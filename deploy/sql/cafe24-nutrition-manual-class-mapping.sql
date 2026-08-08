-- manual review mapping (except deferred 4)

UPDATE public.cm_food_class SET food_code = 'D510-462000000-0001', updated_at = now() WHERE class_key = 'dakgalbi';
UPDATE public.cm_food_class SET food_code = 'D101-004310000-0001', updated_at = now() WHERE class_key = 'soondae_gukbap';
UPDATE public.cm_food_class SET food_code = 'D409-442000000-0001', updated_at = now() WHERE class_key = 'jeon_pajeon';
UPDATE public.cm_food_class SET food_code = 'D410-493000000-0001', updated_at = now() WHERE class_key = 'haemul_bokkeum';
UPDATE public.cm_food_class SET food_code = 'D705-285000000-0001', updated_at = now() WHERE class_key = 'doenjangguk';
UPDATE public.cm_food_class SET food_code = 'D406-333000000-0001', updated_at = now() WHERE class_key = 'maeuntang';
UPDATE public.cm_food_class SET food_code = 'D514-608000000-0001', updated_at = now() WHERE class_key = 'fruit_cup';
UPDATE public.cm_food_class SET food_code = 'A0210152879a', updated_at = now() WHERE class_key = 'jjinppang';
UPDATE public.cm_food_class SET food_code = 'D514-724000000-0001', updated_at = now() WHERE class_key = 'salad';
UPDATE public.cm_food_class SET food_code = 'D701-063000000-0001', updated_at = now() WHERE class_key = 'pork_soup_rice';
UPDATE public.cm_food_class SET food_code = 'D501-007000000-0001', updated_at = now() WHERE class_key = 'gimbap_mayo';
UPDATE public.cm_food_class SET food_code = 'D701-060000000-0001', updated_at = now() WHERE class_key = 'deopbap';
UPDATE public.cm_food_class SET food_code = 'D108-382000000-0001', updated_at = now() WHERE class_key = 'moksal';

UPDATE public.cm_food_class c
   SET fb_kcal = n.kcal,
       fb_carb_g = n.carb_g,
       fb_protein_g = n.protein_g,
       fb_fat_g = n.fat_g,
       updated_at = now()
  FROM public.cm_food_nutrition n
 WHERE n.food_code = c.food_code
   AND n.is_enabled = true
   AND c.class_key IN ('dakgalbi', 'soondae_gukbap', 'jeon_pajeon', 'haemul_bokkeum', 'doenjangguk', 'maeuntang', 'fruit_cup', 'jjinppang', 'salad', 'pork_soup_rice', 'gimbap_mayo', 'deopbap', 'moksal')
   AND n.ctid = (
         SELECT n2.ctid FROM public.cm_food_nutrition n2
          WHERE n2.food_code = c.food_code AND n2.is_enabled = true
          ORDER BY CASE WHEN n2.nutrition_version LIKE 'MFDS%' THEN 2 WHEN n2.nutrition_version LIKE 'FC10%' THEN 1 ELSE 0 END DESC
          LIMIT 1
       );

SELECT count(*) AS mapped FROM public.cm_food_class WHERE food_code IS NOT NULL AND food_code <> '';
SELECT class_key, food_code FROM public.cm_food_class
 WHERE class_key IN ('dakgalbi', 'soondae_gukbap', 'jeon_pajeon', 'haemul_bokkeum', 'doenjangguk', 'maeuntang', 'fruit_cup', 'jjinppang', 'salad', 'pork_soup_rice', 'gimbap_mayo', 'deopbap', 'moksal')
 ORDER BY class_key;
