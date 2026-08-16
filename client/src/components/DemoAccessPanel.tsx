import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, Info, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { DEMO_ACCOUNTS, DemoAccount } from "@/lib/demoAccounts";

const DemoAccessPanel = () => {
  const { login } = useUserStore();
  const navigate = useNavigate();
  const [signingInAs, setSigningInAs] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const signInAs = async (account: DemoAccount) => {
    try {
      setSigningInAs(account.role);
      await login({ email: account.email, password: account.password });
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setSigningInAs(null);
    }
  };

  const copyDetails = async (account: DemoAccount) => {
    // Not available on insecure origins, so a failure here is not worth surfacing.
    try {
      await navigator.clipboard.writeText(`${account.email} / ${account.password}`);
      setCopied(account.role);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-4 mb-6">
      <div className="flex items-start gap-2">
        <Info size={16} className="mt-0.5 shrink-0 text-orange" />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Just looking around? Use a demo account
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
            Creating an account needs an email confirmation, and the free mail service
            this demo runs on will only deliver to the owner's address. Sign in with one
            of these instead — one click, nothing to fill in.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <div
            key={account.role}
            className="flex items-center justify-between gap-3 rounded-md bg-white dark:bg-gray-800 border border-amber-100 dark:border-gray-700 p-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{account.role}</p>
              <p className="text-xs text-gray-500 truncate">{account.description}</p>
              <button
                type="button"
                onClick={() => copyDetails(account)}
                className="mt-1 flex items-center gap-1 text-[11px] font-mono text-gray-500 hover:text-orange transition-colors"
                title="Copy email and password"
              >
                {account.email} / {account.password}
                {copied === account.role ? <Check size={11} /> : <Copy size={11} />}
              </button>
            </div>

            <Button
              type="button"
              size="sm"
              disabled={signingInAs !== null}
              onClick={() => signInAs(account)}
              className="bg-orange hover:bg-hoverOrange shrink-0"
            >
              {signingInAs === account.role ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Signing in
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoAccessPanel;
