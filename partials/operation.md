{% from "./message.md" import message %}

{% macro operation(op, channelName) %}
{% set summary = op.summary() %}
### {% if op.isPublish() %} `publish`{% endif %}{% if op.isSubscribe() %} `subscribe`{% endif %} {{channelName}}

{% if summary -%} *{{ summary }}* {% endif -%}

{{ op.description() }}

#### Message

{% if op.hasMultipleMessages() -%}
Accepts **one of** the following messages:

{% for msg in op.messages() -%}
##### Message #{{loop.index}}
{{ message(msg) }}
{% endfor -%}
{%- else -%}
{{ message(op.message(0)) }}
{%- endif -%}
{% endmacro %}
