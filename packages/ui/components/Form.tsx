import React from 'react'
import * as Form from '@radix-ui/react-form'

const FormDemo = () => (
  <Form.Root className='w-[260px]'>
    <Form.Field className='mb-[10px] grid' name='email'>
      <div className='flex items-baseline justify-between'>
        <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
          Email
        </Form.Label>
        <Form.Message
          className='text-[13px] text-white opacity-[0.8]'
          match='valueMissing'
        >
          Please enter your email
        </Form.Message>
        <Form.Message
          className='text-[13px] text-white opacity-[0.8]'
          match='typeMismatch'
        >
          Please provide a valid email
        </Form.Message>
      </div>
      <Form.Control asChild>
        <input
          className='bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]'
          type='email'
          required
        />
      </Form.Control>
    </Form.Field>
    <Form.Field className='mb-[10px] grid' name='question'>
      <div className='flex items-baseline justify-between'>
        <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
          Question
        </Form.Label>
        <Form.Message
          className='text-[13px] text-white opacity-[0.8]'
          match='valueMissing'
        >
          Please enter a question
        </Form.Message>
      </div>
      <Form.Control asChild>
        <textarea
          className='bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]'
          required
        />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild>
      <button className='text-violet11 shadow-blackA7 hover:bg-mauve3 mt-[10px] box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none'>
        Post question
      </button>
    </Form.Submit>
  </Form.Root>
)

export default FormDemo
