import {
    Layout,
    LayoutHeader,
    LayoutTitle,
  } from "@/components/layout/layout";
  
  export default async function AdminDashboard() {
    return (
      <Layout>
        <LayoutHeader>
          <LayoutTitle>Administration</LayoutTitle>
        </LayoutHeader>
      </Layout>
    );
  }