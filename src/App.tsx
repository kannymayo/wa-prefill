import { useState, useEffect } from "react";

function App() {
  const [phoneRaw, setPhoneRaw] = useState("");
  const [link, setLink] = useState("");
  const defaultMsg =
    "Would appreciate if you could get back to me on the availability. Kindly let me know if you need our profile. Thanks!";
  const [message, setMessage] = useState(defaultMsg);
  const [verificationResult, setVerificationResult] = useState<null | any[]>(
    null
  );
  // last 8 digits, ignoring all other chars
  const phone = phoneRaw.replace(/\D/g, "").slice(-8);

  let displayedFields: [] | string[][] = [];

  if (verificationResult !== null && verificationResult.length > 0) {
    displayedFields = Object.entries(verificationResult[0])
      .filter(([key]) => {
        if (["businessName", "currentEa", "validityDateEnd"].includes(key))
          return true;
      })
      .map(([key, value]) => {
        if (key === "validityDateEnd") {
          const validForDays = Math.floor(
            (new Date(value as string).getTime() - Date.now()) /
              1000 /
              60 /
              60 /
              24
          );
          return ["Valid for", validForDays + " days"];
        } else if (key === "businessName") {
          return ["Name", value];
        } else if (key === "currentEa") {
          return ["Company", value];
        }
        return [key, value];
      }) as string[][];
  }

  useEffect(() => {
    if (phone.length === 8) {
      fetchAgentCEA(phone);

      async function fetchAgentCEA(phone: string) {
        const headersList = {
          Accept: "*/*",
          "Content-Type": "application/json",
        };
        const res = await fetch(
          `https://www.cea.gov.sg/aceas/api/internet/profile/v2/public-register/filter`,
          {
            method: "POST",
            body: JSON.stringify({
              page: 1,
              pageSize: 10,
              sortAscFlag: true,
              sort: "name",
              contactNumber: phone,
              profileType: 2,
            }),
            headers: headersList,
          }
        );

        const data = await res.json();
        setVerificationResult(data.data);
      }
    }
  }, [phone]);

  return (
    <div className="w-96 mx-auto flex flex-col gap-2">
      {/* Phone */}
      <label className="form-control">
        <span className="label">Phone: {phone}</span>
        <input
          type="text"
          className="input input-primary"
          value={phoneRaw}
          onChange={(e) => setPhoneRaw(e.target.value)}
        />
      </label>

      {/* CEA Phone verificaiton */}
      {phone.length === 8 &&
        verificationResult !== null &&
        (verificationResult.length > 0 ? (
          <div className="alert alert-success flex flex-col items-stretch p-2 gap-1">
            <div className="flex justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>{" "}
              <span className="flex-1">Agent details found</span>
            </div>
            <div className=" flex flex-wrap">
              {displayedFields.map(([key, value]) => (
                <div key={key} className="badge">{`${key}: ${value}`}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="alert alert-error flex justify-start p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="flex-1">No CEA record matched</span>
          </div>
        ))}

      {/* Link */}
      <label className="form-control">
        <span className="label">Link</span>
        <textarea
          className="textarea textarea-primary"
          onChange={(e) => setLink(e.target.value)}
          value={link}
        ></textarea>
      </label>

      {/* Custom message + reset button */}
      <div className="form-control">
        <div className="items-center flex gap-4 mb-2">
          <span className="label">Message</span>
          <button
            onClick={() => setMessage(defaultMsg)}
            className="btn btn-outline btn-sm"
          >
            Reset
          </button>
        </div>
        <textarea
          className="textarea textarea-primary min-h-[10em]"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        ></textarea>
      </div>

      <div onClick={handleOpenWA} className="btn btn-primary w-full">
        Start WA
      </div>

      <div className="divider"></div>

      <label className="form-control">
        <span className="label">Memo Board</span>
        <textarea className="textarea textarea-primary"></textarea>
      </label>
    </div>
  );

  function handleOpenWA() {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I came across this listing and I'm very interested in it. Here's the link: ${link}

${message}`)}`;
    window.open(url, "_blank");
    setPhoneRaw("");
    setLink("");
  }
}

export default App;
