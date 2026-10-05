"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { contractChoices, contractGroups, type ContractChoice } from "@/data/contract";

const STORAGE_KEY = "portfolio-contract-choice";

const ContractContext = createContext<{ choice: ContractChoice | null }>({ choice: null });

export function useContract() {
  return useContext(ContractContext);
}

function readStoredChoice(): ContractChoice | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored && stored in contractChoices ? (stored as ContractChoice) : null;
  } catch {
    return null;
  }
}

function storeChoice(choice: ContractChoice) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // storage unavailable (private mode): the gate simply reappears on reload
  }
}

export function ContractProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<ContractChoice | null>(null);
  const [groupIndex, setGroupIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = readStoredChoice();
    if (stored) setChoice(stored);
  }, []);

  const selectChoice = (option: ContractChoice) => {
    storeChoice(option);
    setChoice(option);
  };

  useEffect(() => {
    if (choice !== null) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [choice]);

  return (
    <ContractContext.Provider value={{ choice }}>
      {choice === null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-primary/95 p-6 backdrop-blur-sm">
          <div className="flex w-full max-w-xl flex-col items-center text-center">
            <h2 className="font-heading text-2xl font-semibold text-ink-primary sm:text-3xl">
              Vous êtes intéressé par moi pour:
            </h2>

            {groupIndex === null ? (
              <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
                {contractGroups.map((group, i) => (
                  <button
                    key={group.label}
                    type="button"
                    onClick={() => setGroupIndex(i)}
                    className="rounded-xl border border-accent-cyan/40 bg-bg-surface px-6 py-5 font-heading text-lg font-semibold text-ink-primary transition-all hover:-translate-y-1 hover:border-accent-emerald/60 hover:text-accent-cyan"
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-10 flex w-full flex-col items-center gap-6">
                <div className="grid w-full gap-4 sm:grid-cols-2">
                  {contractGroups[groupIndex].options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectChoice(option)}
                      className="rounded-xl border border-accent-emerald/40 bg-bg-surface px-6 py-5 font-heading text-lg font-semibold text-ink-primary transition-all hover:-translate-y-1 hover:border-accent-cyan/60 hover:text-accent-emerald"
                    >
                      {contractChoices[option].label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setGroupIndex(null)}
                  className="text-sm text-ink-secondary transition-colors hover:text-ink-primary"
                >
                  ← Retour
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </ContractContext.Provider>
  );
}
