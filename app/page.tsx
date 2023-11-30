import { api } from "@/lib/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "Worldy !" });

  return (
    <div>
      <p>{hello ? hello.greeting : "Loading tRPC query..."}</p>
    </div>
  );
}
