
import React, { useState } from "react";
import "./StepByStep.css";

function StepByStep(props) {
  const {facebookUserAccessToken } = props;
  const [shouldShowAllSteps, setShouldShowAllSteps] = useState(false);
  const [facebookPages, setFacebookPages] = useState([]);
  const [instagramAccountId, setInstagramAccountId] = useState();
  const [containerId, setContainerId] = useState();

  return (
  <div>
      <button
        className="btn action-btn"
        style={{ margin: "20px" }}
        onClick={() =>
          shouldShowAllSteps
            ? setShouldShowAllSteps(false)
            : setShouldShowAllSteps(true)
        }
      >
        {shouldShowAllSteps ? "Hide" : "Get Data"}
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
              endpoint={`${facebookPages[0]?.id}/instagram_accounts`}
              requestQueryParams={{
                access_token: facebookUserAccessToken,
              }}
              
              onResponseReceived={(response) => {
                setInstagramAccountId(response.instagram_accounts[0].id);
                console.log(response.instagram_accounts.id);
              }}
              isDisabled={facebookPages.length === 0}
              
            />

            <StepRow
              description="3. Create a media object container"
              method="POST"
              endpoint={`${instagramAccountId}/media`}
              requestQueryParams={{
                access_token: facebookUserAccessToken,
                image_url:
                  "https://images.unsplash.com/photo-1596480047305-57b3094a2df5",
                caption: "Look at this awesome #seagull",
              }}
              onResponseReceived={(response) => {
                setContainerId(response.id);
              }}
              isDisabled={!instagramAccountId}
            />

            <StepRow
              description="4. Publish the media object container"
              method="POST"
              endpoint={`${instagramAccountId}/media_publish`}
              requestQueryParams={{
                access_token: facebookUserAccessToken,
                creation_id: containerId,
              }}
              onResponseReceived={() => {}}
              isDisabled={!containerId}
            />
          </tbody>
        </table>
      ) : null}
      </div>
      </div>
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
            className="btn action-btn"
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
