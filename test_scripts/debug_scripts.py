from dictionary import getCreds, make_api_call
import datetime

def debug_access_token(params):
    endpoint_base = dict()
    endpoint_base['input_token'] = params['access_token']
    endpoint_base['access_token'] = params['access_token']
    url = params['graph_domain'] + '/debug_token'
    return make_api_call( url, endpoint_base, params['debug'] )

params = getCreds()
params['debug'] = 'yes'
response = debug_access_token(params)