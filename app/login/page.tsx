import LoginForm from "../ui/LoginForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-white flex items-center justify-center px-4 py-16">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
                <LoginForm />
            </div>
        </main>
    );
}