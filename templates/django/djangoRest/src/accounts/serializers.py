from rest_framework import serializers, validators
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.auth.password_validation import validate_password

from .models import User

class UserCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        max_length=150,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[
            UnicodeUsernameValidator,
            validators.UniqueValidator(queryset=User.objects.all())
        ]
    )
    password = serializers.CharField(
        required=True,
        min_length=8, 
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        required=True, 
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
        )
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, max_length=150, min_length=3)
    last_name = serializers.CharField(required=True, max_length=150, min_length=3)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate_password(self, value):
        validate_password(value, self.instance)
        return value

    def validate_password2(self, value):
        validate_password(value, self.instance)
        return value
    
    def validate(self, data):
        errors = {}
        password = data['password']
        password2 = data['password2']
        if password and password2 and password != password2:
            errors['password_mismatch'] = _("The two password fields didn't match.")
        if errors:
            raise serializers.ValidationError(errors)
        return data

    def save(self):
        username = self.validated_data['username']
        password = self.validated_data['password']
        email = self.validated_data['email']
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']

        user = User(username=username, email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()
