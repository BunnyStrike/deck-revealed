import { UserButton } from '@clerk/nextjs'

export const Navbar = () => {
  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <a className='btn btn-ghost text-xl normal-case'>daisyUI</a>
      </div>
      <div className='flex-none gap-2'>
        <div className='form-control'>
          <input
            type='text'
            placeholder='Search'
            className='input input-bordered'
          />
        </div>
        <div className='dropdown dropdown-end'>
          <UserButton />
        </div>
      </div>
    </div>
  )
}
