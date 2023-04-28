'use client';

import RegistrationForm from '@/features/RegistrationForm';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

const RegistrationPage = () => {
  return (
    <Dialog open>
      <DialogContent className="h-[600px] max-w-[700px] !p-0">
        <div className="grid grid-cols-[400px_1fr]">
          <div className="">
            <RegistrationForm />
          </div>
          {/* TODO: border radius */}
          <div className="border-b-lg flex flex-col justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-600 via-green-800 to-green-700 pl-4 text-white">
            <p>
              &quot;Using the Excel Simplify has been a{' '}
              <span className="font-medium">game-changer</span> for our team.
              It&apos;s <span className="font-medium">user-friendly</span>{' '}
              design have made our lives much{' '}
              <span className="font-medium">easier</span>.&quot;
            </p>
            <div className="divide-y-[20px]"></div>
            <p className="pt-2 font-medium"> lastName F.</p>
            <p>Sr. Accountant @EY</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationPage;
