from dictionary import getCreds, make_api_call
import datetime
import os
import env

client_id = os.getenv('fb_client_id')
# print(fb_client_id)
client_secret = os.getenv('fb_client_secret')
# print(fb_client_secret)
access_token = os.getenv('fb_access_token')
# print(fb_access_token)
access_url = os.getenv('fb_access_url')
# print (fb_access_url)

graph_url = 'https://graph.facebook.com/v19.0/me/accounts'

def debug_access_token(params):
    endpoint_params = dict()
    endpoint_params['input_token'] = params['access_token']
    endpoint_params['access_token'] = params['access_token']
    url = params['graph_domain'] + '/debug_token'

    return make_api_call( url, endpoint_params, params['debug'] )

params = getCreds()
params['debug'] = 'yes'
response = debug_access_token(params)

print("\nExpires at: ")
print (datetime.datetime.fromtimestamp( response['json_data']['data']['data_access_expires_at'] ))


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
print("\n ---- LONG LIVED ACCESS TOKEN: ----\n")

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
