from dictionary import getCreds, make_api_call

def get_long_lived_access_token(params):
    endpoint_params = {
        'grant_type': 'fb_exchange_token',
        'client_id': params['client_id'],
        'client_secret': params['client_secret'],
        'fb_exchange_token': params['access_token']
    }

    url = params['endpoint_base'] + 'oauth/access_token'  # Correct the endpoint URL

    return make_api_call(url, endpoint_params, params['debug'])

params = getCreds()
params['debug'] = 'yes'
access_token_key = 'access_token'  # Define the key to access the access token

response = get_long_lived_access_token(params)

print("\n ---- ACCESS TOKEN INFO ----\n")

# Check if the 'json_data' key is present in the response
if 'json_data' in response:
    # Check if the access_token_key exists in the 'json_data' dictionary
    if access_token_key in response['json_data']:
        print("Access Token: ")
        print(response['json_data'][access_token_key])
    else:
        print(f"The '{access_token_key}' key is not present in the 'json_data' dictionary.")
else:
    print("The 'json_data' key is not present in the response.")
