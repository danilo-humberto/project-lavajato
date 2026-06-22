import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

type ProtectedRouteProps = {
  children: ReactNode;
};

type AccessState = "checking" | "unauthenticated" | "unauthorized" | "authorized";

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [accessState, setAccessState] = useState<AccessState>("checking");

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        if (isMounted) {
          setAccessState("unauthenticated");
        }
        return;
      }

      try {
        const adminRef = doc(db, "admins", currentUser.uid);
        const adminSnapshot = await getDoc(adminRef);

        if (isMounted) {
          setAccessState(adminSnapshot.exists() ? "authorized" : "unauthorized");
        }
      } catch (error) {
        console.error("Erro ao verificar permissao administrativa:", error);

        if (isMounted) {
          setAccessState("unauthorized");
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (accessState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fdff] px-4 text-center">
        <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-soft">
          <p className="text-lg font-black text-ink">Verificando permissoes...</p>
        </div>
      </div>
    );
  }

  if (accessState === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  if (accessState === "unauthorized") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fdff] px-4 text-center">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-red-500">Acesso bloqueado</p>
          <h1 className="mt-3 text-2xl font-black text-ink">Usuario sem permissao administrativa.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Entre com uma conta cadastrada na lista de administradores para acessar o painel.
          </p>
          <button
            type="button"
            onClick={() => {
              void signOut(auth).finally(() => {
                window.location.href = "/admin/login";
              });
            }}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-aqua to-ocean px-6 text-sm font-black text-white shadow-card"
          >
            Voltar para login
          </button>
        </div>
      </div>
    );
  }

  return children;
}
