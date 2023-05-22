export const Navbar = () => {
  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <a className='btn-ghost btn text-xl normal-case'>daisyUI</a>
      </div>
      <div className='flex-none gap-2'>
        <div className='form-control'>
          <input
            type='text'
            placeholder='Search'
            className='input-bordered input'
          />
        </div>
        <div className='dropdown-end dropdown'></div>
      </div>
    </div>
  )
}
