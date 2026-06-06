import { AuthPage } from "../../components/AuthPage";

type LoginPageProps = {
    searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;
    return <AuthPage mode="login" error={params.error} />;
}
