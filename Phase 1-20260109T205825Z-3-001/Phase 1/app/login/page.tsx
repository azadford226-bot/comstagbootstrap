import LoginForm from "@/components/organisms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
          Welcome Back
        </h1>
        <p className="text-3xl sm:text-4xl md:text-[48px] text-white text-center font-['Hubballi']">
          Sign in to Your Account
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        <LoginForm />
      </div>
    </div>
  );
}
