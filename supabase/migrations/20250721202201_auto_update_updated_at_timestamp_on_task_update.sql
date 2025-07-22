alter table "public"."tasks" add column "created_at" timestamp with time zone default now();

alter table "public"."tasks" add column "updated_at" timestamp with time zone;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if row(new) is distinct from row(old) then
    new.updated_at = now();
  end if;
  return new;
end;
$function$
;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


