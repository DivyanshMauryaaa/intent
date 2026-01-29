import { SignUp } from '@clerk/nextjs';
import { ChartLine, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className='bg-muted grid flex-1 lg:grid-cols-2'>
      <div className='hidden flex-1 items-center justify-end p-6 md:p-10 lg:flex'>
        <ul className='max-w-sm space-y-8'>
          <li>
            <div className='flex items-center gap-2'>
              <Clock className='size-4' />
              <p className='font-semibold'>Save time</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>

            </p>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <ChartLine className='size-4' />
              <p className='font-semibold'>Automate complex workflows</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>
              
            </p>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <ShieldCheck className='size-4' />
              <p className='font-semibold'>Business Context Organized</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>

            </p>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <Sparkles className='size-4' />
              <p className='font-semibold'>Complete tasks while talking</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>
              
            </p>
          </li>
        </ul>
      </div>
      <div className='flex flex-1 items-center justify-center p-6 md:p-10 lg:justify-start'>
        <SignUp />
      </div>
    </div>
  );
}
