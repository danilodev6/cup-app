import prisma from "@/lib/prisma";

export default async function UserPage() {
  const users = await prisma.user.findMany();
}
// return (
//   <div className="p-4">
//   <h1 className="text-2xl font-bold mb-4">User List</h1>
//   <ul className="list-disc pl-5">
//   <li key={user.id}></li></ul>
//   </div>)
//
