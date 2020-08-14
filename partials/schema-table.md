{% macro schemaTable(prop, propName, required=false, path='', circular=false) %}

<tr>
  <td>{{ path | tree }}{{ propName }} {% if required %}<strong>(required)</strong>{% endif %}</td>
  <td>{{ prop.type() }}{%- if prop.anyOf() -%}anyOf{%- endif -%}{%- if prop.allOf() -%}allOf{%- endif -%}{%- if prop.oneOf() %}oneOf{%- endif -%}{%- if prop.items().type %}({{prop.items().type()}}){%- endif -%}</td>
  <td>{{ prop.description() | markdown2html | safe }} {% if circular %}<strong>[CIRCULAR]</strong>{% endif %}</td>
  <td>{{ prop.enum() | acceptedValues | safe }}</td>
</tr>

{%- endmacro -%}