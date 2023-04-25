const { default: axios } = require('axios')
const fs = require('fs')
const package = require('../package.json')
const child_process = require('child_process')
const os = require('os')
const crypto = require('crypto')

if (require.main === module) {
    main();
}

async function main() {
    let placeholder = ""
    let releaseTime = ""
    if (process.argv[2] === "release") {
        const { data } = await axios.get("https://api.github.com/repos/BunnyStrike/revealed/releases/latest")
        const appimage = data.assets.find((asset) => asset.browser_download_url.includes(".AppImage"))
        const outputFile = `${os.tmpdir()}/Revealed.AppImage`
        child_process.spawnSync("curl", ["-L", appimage.browser_download_url, "-o", outputFile, "--create-dirs"])
        const outputContent = fs.readFileSync(outputFile)
        const hashSum = crypto.createHash('sha512');
        hashSum.update(outputContent);
        const sha512 = hashSum.digest('hex');
        fs.rmSync(outputFile)

        placeholder = [
            "type: file",
            `url: ${appimage.browser_download_url}`,
            `sha512: ${sha512}`
        ].join("\n        ")
        releaseTime = data.published_at.split('T')[0]
    } else {
        placeholder = [
            "type: file",
            `path: "../dist/Revealed-${package.version}.AppImage"`
        ].join("\n        ")
        releaseTime = new Date().toISOString().split('T')[0]
    }

    // generate flatpak-build
    if (!fs.existsSync("./flatpak-build")) {
        fs.mkdirSync('./flatpak-build', { recursive: true })
    }

    // generate manifest
    let templateManifest = fs.readFileSync(`./flatpak/templates/com.bunnystrike.revealed.yml.template`, { encoding: 'utf-8' })
    templateManifest = templateManifest.replace("${revealed-app-image}", placeholder)
    fs.writeFileSync("./flatpak-build/com.bunnystrike.revealed.yml", templateManifest)

    // generate metainfo
    let templateMetaInfo = fs.readFileSync(`./flatpak/templates/com.bunnystrike.revealed.metainfo.xml.template`, { encoding: 'utf-8' })
    templateMetaInfo = templateMetaInfo.replace("${revealed-version}", `v${package.version}`).replace("${revealed-release-date}", releaseTime)
    fs.writeFileSync("./flatpak-build/com.bunnystrike.revealed.metainfo.xml", templateMetaInfo)

    // copy extra files
    fs.copyFileSync("./flatpak/com.bunnystrike.revealed.desktop", "./flatpak-build/com.bunnystrike.revealed.desktop")
    fs.copyFileSync("./flatpak/com.bunnystrike.revealed.png", "./flatpak-build/com.bunnystrike.revealed.png")
    fs.copyFileSync("./flatpak/flathub.json", "./flatpak-build/flathub.json")
    fs.cpSync("./flatpak/patches", "./flatpak-build/patches", { recursive: true })
}
