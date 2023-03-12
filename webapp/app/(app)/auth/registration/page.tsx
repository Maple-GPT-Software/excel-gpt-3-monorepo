import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog/Dialog';

const RegistrationPage = () => {
  return (
    <Dialog open>
      <DialogContent className="h-[600px] max-w-[700px] !p-0">
        <div className="grid grid-cols-[400px_1fr]">
          <div className="">main content</div>
          {/* TODO: border radius */}
          <div className="border-b-lg flex flex-col justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-600 via-green-800 to-green-700 pl-4 text-white">
            <p>
              "Using the Excel Simplify has been a <span className="font-medium">game-changer</span> for our team. It's
              <span className="font-medium">user-friendly</span> design have made our lives much{' '}
              <span className="font-medium">easier</span>."
            </p>
            <div className="divide-y-[20px]"></div>
            <p className="font-medium pt-2"> lastName F.</p>
            <p>Sr. Accountant @EY</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationPage;
