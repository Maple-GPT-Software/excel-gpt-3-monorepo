'use client';

import GoogleSheetContent from './googleSheet.mdx';
import ManageSubscription from './manageSubscription.mdx';
import type { FunctionComponent } from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { Tabs, TabsList } from '@/components/ui/Tabs';
import { TabsContent, TabsTrigger } from '@/components/ui/Tabs';

const Dashboard: FunctionComponent = () => {
  const { simplifyUser } = useAuthContext();

  return (
    <Tabs defaultValue="google_sheet" className="flex-1">
      <TabsList>
        <TabsTrigger
          className="flex-auto border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          value="google_sheet"
        >
          Google Sheet
        </TabsTrigger>
        <TabsTrigger
          className="flex-auto border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          value="prompt_guide"
        >
          Manage Subscription
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mx-4 mt-8" value="google_sheet">
        <GoogleSheetContent />
      </TabsContent>
      <TabsContent className="mx-4 mt-8" value="prompt_guide">
        <ManageSubscription />
      </TabsContent>
    </Tabs>
  );
};

export default Dashboard;
