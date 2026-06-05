-- Rewrite legacy AWS image/CDN URLs to Cafe24 local files CDN.
-- Run against cama DB after S3 objects are synced under upload/... keys.

BEGIN;

-- Legacy S3 direct URLs (hash keys at bucket root)
UPDATE cm_contents SET contents = REPLACE(contents, 'https://cama-files.s3.ap-northeast-2.amazonaws.com/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%cama-files.s3.ap-northeast-2.amazonaws.com%';
UPDATE cm_contents SET contents = REPLACE(contents, 'https://cama-images.s3.ap-northeast-2.amazonaws.com/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%cama-images.s3.ap-northeast-2.amazonaws.com%';
UPDATE cm_wellbeing_resources SET contents = REPLACE(contents, 'https://cama-files.s3.ap-northeast-2.amazonaws.com/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%cama-files.s3.ap-northeast-2.amazonaws.com%';
UPDATE cm_wellbeing_resources SET thumbnail = REPLACE(thumbnail, 'https://cama-files.s3.ap-northeast-2.amazonaws.com/', 'https://camaplus.cafe24.com/files/') WHERE thumbnail LIKE 'https://cama-files.s3.%';

-- Known CDN / S3 website prefixes from production era
UPDATE cm_contents SET image = REPLACE(image, 'https://d3n20da161n8ia.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE image LIKE 'https://d3n20da161n8ia.cloudfront.net/%';
UPDATE cm_contents SET image = REPLACE(image, 'https://d2wzajvlsrz16a.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE image LIKE 'https://d2wzajvlsrz16a.cloudfront.net/%';
UPDATE cm_contents SET image = REPLACE(image, 'https://d3r7myc2vsc0rw.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE image LIKE 'https://d3r7myc2vsc0rw.cloudfront.net/%';

UPDATE cm_doctor SET profile_image = REPLACE(profile_image, 'https://d3n20da161n8ia.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE profile_image LIKE 'https://d3n20da161n8ia.cloudfront.net/%';
UPDATE cm_doctor SET profile_image = REPLACE(profile_image, 'https://d2wzajvlsrz16a.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE profile_image LIKE 'https://d2wzajvlsrz16a.cloudfront.net/%';
UPDATE cm_doctor SET profile_image = REPLACE(profile_image, 'https://d3r7myc2vsc0rw.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE profile_image LIKE 'https://d3r7myc2vsc0rw.cloudfront.net/%';

UPDATE account SET profile_image = REPLACE(profile_image, 'https://d3n20da161n8ia.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE profile_image LIKE 'https://d3n20da161n8ia.cloudfront.net/%';
UPDATE account SET profile_image = REPLACE(profile_image, 'https://d2wzajvlsrz16a.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE profile_image LIKE 'https://d2wzajvlsrz16a.cloudfront.net/%';
UPDATE account SET profile_image = REPLACE(profile_image, 'https://d3r7myc2vsc0rw.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE profile_image LIKE 'https://d3r7myc2vsc0rw.cloudfront.net/%';

-- HTML 본문·웰빙 리소스 내 embedded CloudFront URL
UPDATE cm_contents SET contents = REPLACE(contents, 'https://d3n20da161n8ia.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%https://d3n20da161n8ia.cloudfront.net/%';
UPDATE cm_contents SET contents = REPLACE(contents, 'https://d2wzajvlsrz16a.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%https://d2wzajvlsrz16a.cloudfront.net/%';
UPDATE cm_contents SET contents = REPLACE(contents, 'https://d3r7myc2vsc0rw.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%https://d3r7myc2vsc0rw.cloudfront.net/%';

UPDATE cm_wellbeing_resources SET thumbnail = REPLACE(thumbnail, 'https://d3n20da161n8ia.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE thumbnail LIKE 'https://d3n20da161n8ia.cloudfront.net/%';
UPDATE cm_wellbeing_resources SET thumbnail = REPLACE(thumbnail, 'https://d2wzajvlsrz16a.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE thumbnail LIKE 'https://d2wzajvlsrz16a.cloudfront.net/%';
UPDATE cm_wellbeing_resources SET thumbnail = REPLACE(thumbnail, 'https://d3r7myc2vsc0rw.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE thumbnail LIKE 'https://d3r7myc2vsc0rw.cloudfront.net/%';

UPDATE cm_wellbeing_resources SET contents = REPLACE(contents, 'https://d3n20da161n8ia.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%https://d3n20da161n8ia.cloudfront.net/%';
UPDATE cm_wellbeing_resources SET contents = REPLACE(contents, 'https://d2wzajvlsrz16a.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%https://d2wzajvlsrz16a.cloudfront.net/%';
UPDATE cm_wellbeing_resources SET contents = REPLACE(contents, 'https://d3r7myc2vsc0rw.cloudfront.net/', 'https://camaplus.cafe24.com/files/') WHERE contents LIKE '%https://d3r7myc2vsc0rw.cloudfront.net/%';

COMMIT;
