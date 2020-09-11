{% from "./schema-table.md" import schemaTable %}
{% macro schemaProp(prop, propName, required=false, path='', circularPropsParent) %}

{{- schemaTable(prop, propName, required, path) -}}
{%- for p in prop.anyOf() -%}{% set pName %}<{{ loop.index }}>{% endset %}
{{- schemaProp(p, pName, path=(propName | buildPath(path, pName))) -}}
{%- endfor -%}
{%- for p in prop.allOf() -%}{% set pName %}<{{ loop.index }}>{% endset %}
{{- schemaProp(p, pName, path=(propName | buildPath(path, pName))) -}}
{%- endfor -%}
{%- for p in prop.oneOf() -%}
{% set pName %}<{{ loop.index }}>{% endset %}
{{- schemaProp(p, pName, path=(propName | buildPath(path, pName))) -}}
{%- endfor -%}
{%- for pName, p in prop.properties() -%}
{% set circProps = p.circularProps() %}
{% set isPropCircular = circularPropsParent | includes(pName) %}
{% if isPropCircular === true %}
{{- schemaTable(p, pName, prop | isRequired(pName), propName | buildPath(path, pName), isPropCircular) -}}
{% else %}
{{- schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop | isRequired(pName)), circProps) -}}
{% endif %}
{%- endfor -%}
{%- if prop.additionalProperties() and prop.additionalProperties().properties -%}
{%- for pName, p in prop.additionalProperties().properties() -%}
{{- schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop.additionalProperties() | isRequired(pName))) -}}
{%- endfor -%}
{%- endif %}
{%- if prop.items() and prop.items().properties -%}
{%- for pName, p in prop.items().properties() -%}
{% set isCirc = p.isCircular() %}
{% if isCirc === true %}
{{- schemaTable(prop, propName, prop | isRequired(pName), propName | buildPath(path, pName), isCirc) -}}
{% else %}
{{- schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop.items() | isRequired(pName))) -}}
{% endif %}
{%- endfor -%}
{%- endif -%}
{%- endmacro -%}
