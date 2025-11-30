import prisma from "@/lib/prisma";
import Form from "next/form";

interface User {
  id: number;
  name: string;
  password: string;
}

export default async function UserPage() {
  const users = await prisma.user.findMany();

  async function createUser(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    await prisma.user.create({
      data: {
        name,
        password,
      },
    });
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <ul className="list-disc pl-5">
          {users.map((user: User) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div className="p-4 mt-8">
        <Form action={createUser}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            ></label>
            <input type="text" id="name" name="name" placeholder="enter name" />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            ></label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Create
          </button>
        </Form>
      </div>
    </>
  );
}
