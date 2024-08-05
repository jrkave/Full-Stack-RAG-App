from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .chatbot import chat
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            query = data.get('query')
            character = data.get('character', 'generic')
            history = data.get('history', 'None')
            if query:
                response = chat(query, character, history)
                return JsonResponse({'response': response})
            return JsonResponse({'error': 'No query provided'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
