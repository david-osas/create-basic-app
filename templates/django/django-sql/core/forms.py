from django import forms

class InstaloaderForm(forms.Form):
  username = forms.CharField(label='Username')
  password = forms.CharField(label='Password')
  shortcode = forms.CharField(label='Shortcode')