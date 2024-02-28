import React from "react";
import {Spinner} from "@nextui-org/react";

export default function LoadingState() {
  return (
    <>
        <div className="h-screen grid place-items-center">
            <Spinner size="lg" label="Loading..." color="primary" />
        </div>
    </>
  );
}
