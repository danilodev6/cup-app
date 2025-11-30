import prisma from "@/lib/prisma";

interface User {
  id: number;
  name: string;
}

export default async function UserPage() {
  const users = await prisma.user.findMany();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="list-disc pl-5">
        {users.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
