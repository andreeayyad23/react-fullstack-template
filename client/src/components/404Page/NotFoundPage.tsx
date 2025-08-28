// NotFoundPage.tsx
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <p className="text-indigo-400 text-xl font-medium tracking-wider uppercase">
            {t("notFound.errorCode")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            {t("notFound.title")}
          </h1>
          <p className="mt-2 text-base text-gray-400">
            {t("notFound.message")}
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("notFound.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;