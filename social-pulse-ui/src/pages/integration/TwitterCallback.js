import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  AUTHORIZE_INSTAGRAM,
  AUTHORIZE_TWITTER,
} from "../../graphql/mutations";

function TwitterCallback() {
  const { currentUser } = useAuth();
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [integrated, setIntegrated] = useState();
  const code = searchParams.get("code");
  const verifier = localStorage.getItem("twitter_code_verifier");
  const [authorizeTwitter, { loading: apiLoading, data, error }] =
    useMutation(AUTHORIZE_TWITTER);

  useEffect(() => {
    if (code && verifier) {
      authorizeTwitter({
        variables: {
          authorizeTwitterInput: {
            businessId: currentUser.uid,
            code: code,
            verifier: verifier,
          },
        },
      }).then((res) => {
        console.log(res);
        if (res.data.authorizeTwitter.id !== null) {
          setIntegrated(true);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [code, verifier]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="animate-spin text-blue-600 text-6xl font-poppins font-extrabold text-center">
          <AiOutlineLoading3Quarters />
        </h1>
      </div>
    );
  } else if (integrated) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
  <div className="bg-white p-10 rounded-lg shadow-lg max-w-md text-center transform transition-all duration-500 hover:scale-105">
    <h1 className="text-blue-700 text-6xl font-poppins font-extrabold mb-4 animate-bounce">
      Success!
    </h1>
    <p className="text-gray-700 text-lg mb-6">
      You've successfully linked <span className="font-semibold">Social-pulse</span> with your Twitter account!
    </p>
    <button className="bg-blue-700 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-800 transition duration-300">
      Go to Dashboard
    </button>
  </div>
</div>

    );
  } else {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-red-500 text-6xl font-poppins font-extrabold text-center">
          Error!
        </h1>
      </div>
    );
  }
}

export default TwitterCallback;
