'use client';

import GoogleSheetContent from './googleSheet.mdx';
import OpenApiKeyGuide from './openAiKeyGuide.mdx';
import Overview from './overview.mdx';
import PromptGuideContent from './promptGuide.mdx';
import type { FunctionComponent } from 'react';

import { useAuthContext } from '@/contexts/AuthProvider';

import { Tabs, TabsList } from '@/components/ui/Tabs';
import { TabsContent, TabsTrigger } from '@/components/ui/Tabs';

const Dashboard: FunctionComponent = () => {
  const { simplifyUser } = useAuthContext();
  console.log(simplifyUser);

  return (
    <Tabs defaultValue="overview" className="flex-1">
      <TabsList>
        <TabsTrigger
          className="flex-auto border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          value="overview"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          className="flex-auto border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          value="google sheet"
        >
          Google Sheet
        </TabsTrigger>
        <TabsTrigger
          className="flex-auto border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          value="prompt guide"
        >
          Prompt Guide
        </TabsTrigger>
        <TabsTrigger
          className="flex-auto border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          value="openAi key"
        >
          OpenAi API Key
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mx-4 mt-8" value="overview">
        <Overview />
      </TabsContent>
      <TabsContent className="mx-4 mt-8" value="google sheet">
        <GoogleSheetContent />
      </TabsContent>
      <TabsContent className="mx-4 mt-8" value="prompt guide">
        <PromptGuideContent />
      </TabsContent>
      <TabsContent className="mx-4 mt-8" value="openAi key">
        <OpenApiKeyGuide />
      </TabsContent>
    </Tabs>
  );
};

export default Dashboard;
