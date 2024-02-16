import React, { useState } from "react";
import "./StepByStep.css";

function StepByStep(props) {
  const { facebookUserAccessToken } = props;
  const [shouldShowAllSteps, setShouldShowAllSteps] = useState(false);
  const [facebookPages, setFacebookPages] = useState([]);
  // eslint-disable-next-line
  const [instagramAccountId, setInstagramAccountId] = useState();


  return (
    <section className="getInstagramAccountId">
      <button
        className="step-btn"
        style={{ margin: "20px" }}
        onClick={() =>
          shouldShowAllSteps
            ? setShouldShowAllSteps(false)
            : setShouldShowAllSteps(true)
        }
      >
        {shouldShowAllSteps ? "Hide" : "Get Posts"}
      </button>
      <div className="table-responsive">
        {shouldShowAllSteps ? (
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Step description</th>
                <th>HTTP method</th>
                <th>Endpoint</th>
                <th>Request query parameters</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              <StepRow
                description="1. Get Facebook pages of the logged in user"
                method="GET"
                endpoint="me/accounts"
                requestQueryParams={{ access_token: facebookUserAccessToken }}
                onResponseReceived={(response) => {
                  setFacebookPages(response.data);
                }}
                isDisabled={!facebookUserAccessToken}
              />

              <StepRow
                description="2. Get Instagram business account connected to the Facebook page"
                method="GET"
                endpoint={`${facebookPages[0]?.id}?fields=instagram_business_account?access_token=${facebookUserAccessToken}`}
                requestQueryParams={{
                  access_token: facebookUserAccessToken,
                  fields: "instagram_business_account",
                }}
                onResponseReceived={(response) => {
                  setInstagramAccountId(response.instagram_business_account.id);
                  response = response.id[0]
                  console.log(instagramAccountId)
                }}
                isDisabled={facebookPages.length === 0}
              />
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  );
}

const StepRow = (props) => {
  const {
    description,
    endpoint,
    method,
    requestQueryParams,
    onResponseReceived,
    isDisabled,
  } = props;

  const [response, setResponse] = useState();
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const completeStep = () => {
    setIsSendingRequest(true);
    window.FB.api(endpoint, method, requestQueryParams, (response) => {
      setResponse(response);
      onResponseReceived(response);
      setIsSendingRequest(false);
    });
  };

  return (
    <tr>
      <td>{description}</td>
      <td>{method}</td>
      <td>{`https://graph.facebook.com/v19.0/${endpoint}`}</td>
      <td>
        <pre>{JSON.stringify(requestQueryParams, null, 2)}</pre>
      </td>
      <td>
        {response ? (
          <pre>{JSON.stringify(response, null, 2)}</pre>
        ) : (
          <button
            onClick={completeStep}
            className="send-request"
            disabled={isDisabled || isSendingRequest}
          >
            {isSendingRequest ? "Sending..." : "Send request"}
          </button>
        )}
      </td>
    </tr>
  );
};

export default StepByStep;
