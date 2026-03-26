import { redirect } from "next/navigation";

/** Legacy path; feed lives on the dashboard. */
export default function PostsPageRedirect() {
  redirect("/dashboard");
}
