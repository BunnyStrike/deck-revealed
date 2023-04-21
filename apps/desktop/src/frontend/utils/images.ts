export async function searchSteamgridImage(
  title: string
): Promise<string | undefined | null> {
  const res = await fetch(
    `https://steamgrid.usebottles.com/api/search/${title}`
  )
  console.log(title, res)

  if (res.status === 200) {
    const steamGridImage = (await res.json()) as string
    console.log(steamGridImage)
    if (steamGridImage && steamGridImage.startsWith('http')) {
      return steamGridImage
    }
  }
  return null
}
