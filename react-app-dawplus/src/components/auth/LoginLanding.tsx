import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/Button";
import { setAuthSessionAtom } from "@/atoms/authSessionAtom";
import { removeTokenEncryptedStorage } from "@/lib/encryptedStorage";
import { queryClient } from "@/lib/queryClient";
import { motion } from "framer-motion";
import * as React from "react";
import welcomeImage from "@/assets/images/character/welcome.png";
import SplitText from "@/components/SplitText";

type LoginLandingProps = {
  redirect?: string;
};

export function LoginLanding({ redirect }: LoginLandingProps) {
  const navigate = useNavigate();
  const setAuthSession = useSetAtom(setAuthSessionAtom);

  React.useEffect(() => {
    void (async () => {
      await removeTokenEncryptedStorage();
      setAuthSession(null);
      queryClient.clear();
    })();
  }, [setAuthSession]);

  return (
    <section className="min-h-[100dvh] bg-[#f2f7f5] text-slate-900 overflow-hidden relative flex flex-col">
      <div className="mx-auto flex flex-1 w-full max-w-md flex-col justify-between px-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute -right-20 -top-20 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute -left-20 bottom-40 -z-10 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />

        <div className=" pt-4 z-10">
          <SplitText
            text="안녕하세요"
            tag="p"
            textAlign="left"
            className="text-3xl font-light tracking-tight text-slate-700"
            delay={30}
          />
          <SplitText
            text="Cama+입니다"
            tag="h1"
            textAlign="left"
            className="text-5xl font-black tracking-tight text-primary drop-shadow-sm -mt-5"
            delay={30}
            to={{ opacity: 1, y: 0, delay: 0.2 }}
          />
        </div>

        <div className="flex flex-1 items-center justify-center z-10 relative min-h-[200px]">
          <motion.img
            src={welcomeImage}
            alt="Welcome Character"
            className="w-full max-w-[300px] object-contain relative z-10"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>

        <div className="space-y-4 pb-2 z-10">
          <Button
            type="button"
            className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={() =>
              navigate({
                to: "/login/credentials",
                search: redirect ? { redirect } : {},
              })
            }
          >
            로그인
          </Button>
        </div>
      </div>
    </section>
  );
}
