import { TonConnectButton } from "@tonconnect/ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Header = () => {
  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box justify-between">
      <div className="flex gap-3">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <span className="text-4xl">🌔</span>
          </button>
        </div>
        <div className="flex-1 px-2 mx-2">
          <div className="text-sm breadcrumbs">
            <ul className="text-xl">
              <li>
                <span className="opacity-40">{"tonraffles".toUpperCase()}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-none">
        <TonConnectButton className="button_ton_connect_button" />
      </div>
    </div>
  );
};

export default Header;
