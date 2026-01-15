-- 1. Insert a new record into the account table
INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

-- 2. Change Tony Stark's account type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. Delete Tony Stark's record
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 4. Modify the description of the "GM Hummer"
-- Change "small interiors" to "a huge interior"
UPDATE public.inventory
SET inv_description = REPLACE(
  inv_description,
  'small interiors',
  'a huge interior'
)
WHERE inv_make = 'GM'
AND inv_model = 'Hummer';

-- 5. INNER JOIN: show make, model and classification_name
-- for vehicles in the "Sport" category
SELECT
  i.inv_make,
  i.inv_model,
  c.classification_name
FROM public.inventory i
INNER JOIN public.classification c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update all image paths by adding "/vehicles"
UPDATE public.inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
