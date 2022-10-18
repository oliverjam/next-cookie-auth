import Link from "next/link";
import { getUserFromSession } from "../lib/database/model.js";

export function getServerSideProps(context) {
  const sid = context.req.cookies.sid;
  const user = getUserFromSession(sid) || null;
  return { props: { user } };
}

export default function Home({ user }) {
  if (user) {
    return (
      <>
        <h1>Welcome back {user.email}</h1>
        <form action="/api/log-out" method="POST">
          <button>Log out</button>
        </form>
      </>
    );
  }
  return (
    <>
      <h1>Welcome to The App</h1>
      <Link href="/log-in">Log in</Link> or <Link href="/sign-up">Sign up</Link>
    </>
  );
}
