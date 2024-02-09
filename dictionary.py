import requests
import json
import os
import env

client_id = os.getenv('fb_client_id')
# print(fb_client_id)
client_secret = os.getenv('fb_client_secret')
# print(fb_client_secret)
access_token = os.getenv('fb_access_token')
# print(fb_access_token)
fb_access_url = os.getenv('fb_access_url')
# print (fb_access_url)


def getCreds():
    creds = dict()
    creds['access_token'] = os.getenv('fb_access_token')
    creds['client_id'] = client_id
    creds['client_secret'] = client_secret
    creds['graph_domain'] = 'https://graph.facebook.com/'
    creds['graph_version'] = 'v19.0'
    creds['endpoint_base'] = creds['graph_domain'] + creds['graph_version'] + '/'
    creds['debug']  = 'no'

    return creds

def make_api_call( url, endpoint_params, debug = 'no' ) :
    data = requests.get( url, endpoint_params )

    response = dict()
    response['url'] = url
    response['endpoint_params'] = endpoint_params
    response['endpoint_params_pretty'] = json.dumps(endpoint_params, indent=4)
    response['json_data'] = json.loads(data.content)
    response['json_data_pretty'] = json.dumps( response ['json_data'], indent = 4 )

    if ( 'yes' == debug ) :
        display_api_call( response )

    return response

def display_api_call(response):
    print("\nURL: ")
    print(response['url'])
    print("\nEndpoint Params: ")
    print(response['endpoint_params_pretty'])
    print("\nResponse: ")
    print(response['json_data_pretty'])
