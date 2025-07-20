import { Suspense } from 'react';
import { getQueryClient, trpc } from '@/trpc/server';
import {  HydrationBoundary, dehydrate } from '@tanstack/react-query';
import Client from "@/app/client"
export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({text:"Shafi"}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loding...</p>}>
        <Client/>
      </Suspense>
    </HydrationBoundary>
  );
}
