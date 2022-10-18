export default function SignUp() {
  return (
    <section>
      <h1>Sign up for a new account</h1>
      <form action="/api/sign-up" method="POST">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button>Sign up</button>
      </form>
    </section>
  );
}
