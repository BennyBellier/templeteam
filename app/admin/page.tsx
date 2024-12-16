import {
    Layout,
    LayoutHeader,
    LayoutTitle,
    LayoutDescription,
  } from "@/components/layout/layout";
import { getServerAuthSession } from "@/server/auth";
  
export default async function AdminDashboard() {
    const session = await getServerAuthSession();

    return (
      <Layout noContact noReferences>
        <LayoutHeader>
          <LayoutTitle>Administration</LayoutTitle>
          <LayoutDescription>&apos;{session?.user.email}&apos; &apos;{session?.user.id}&apos; &apos;{session?.user.name}&apos; &apos;{session?.user.image ? session?.user.image : "null" }&apos; &apos;{session?.user.role}&apos;</LayoutDescription>
        </LayoutHeader>
      </Layout>
    );
  }