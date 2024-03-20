export const en = {
  auth_login_invalid: "Invalid credentials.",
  auth_register_invalid:
    "Email already taken or the form was not filled properly.",

  logout: "Log out",
  login: "Log in",
  login_welcome: "Welcome. Please log in.",
  login_noAccount: "Don't have an account yet?",
  login_registerHere: "Register here!",

  register: "Register",
  register_welcome: "Welcome. Please register.",
  register_accountAlready: "Already have an account?",
  register_loginHere: "Log in here!",

  register_form_reasonQuestion: "Why do you want to use the app?",
  register_form_reasonDietitian: "I want to create diet plans for others.",
  register_form_reasonClient: "I need help with creating my diet plan.",
  register_form_tellAboutYou:
    "Tell your future clients something about yourself:",

  password_error_noPassword: "Please provide a password.",
  password_error_length:
    "The password must be between 8 and 32 characters long.",
  password_error_noLowercase:
    "The password must contain at least one lower-case letter.",
  password_error_noUppercase:
    "The password must contain at least one upper-case letter.",
  password_error_noDigit: "The password must contain at least one digit.",
  password_error_noSpecial:
    "The password must contain at least one of the following characters: ! @ # $ % ^ & *",
  password_error_repeatMismatch: "Provided passwords do not match.",
  password_error_noCurrent: "You must provide your current password.",

  email_error_noEmail: "Please provide an email address.",
  email_error_invalid: "Please provide a valid email address.",

  firstName_error_missing: "Please provide your first name.",
  familyName_error_missing: "Please provide your surname.",

  email: "Email",
  password: "Password",
  password_repeat: "Repeat password",
  first_name: "Name",
  family_name: "Surname",
  about_person: "Description",
  profile_picture: "Profile picture",
  default_image: "Default image",

  home: "Home",
  home_welcome: "Welcome",
  home_profile: "Profile",
  home_clients: "Clients",
  home_ingredients: "Ingredients",
  home_community: "Community",
  home_templates: "Template Meals",
  home_myMeals: "My Meals",

  go_back: "Go back",
  search: "Search",
  edit: "Edit",
  delete: "Delete",

  form_startEditing: "Start editing",
  form_stopEditing: "Stop editing",
  form_saveChanges: "Save changes",
  form_resetChanges: "Reset changes",
  form_error_updateAndRetry:
    "An error has occured. Please make some changes and try again.",
  form_error_relog:
    "An unexpected error has occured. Please, try logging out and back in again.",

  profile_form_updateProfileHeading: "Update your profile",
  profile_form_pfpURL: "Profile picture URL",
  profile_form_emptyPfp: "If left empty, the above default image will be used.",
  profile_form_description: "About",
  profile_form_updatePasswordHeading: "Update your password",
  profile_form_changePassword: "Change password",
  profile_form_doNotChangePassword: "Do not change password",
  profile_form_currentPassword: "Current password",
  profile_form_newPassword: "New password",
  profile_form_newPasswordRepeat: "Repeat new password",

  profile_fetchingData: "Fetching profile data...",
  profile_ratings: "Ratings",

  community_searchForDietitian: "Search for a dietitian",
  community_previousResults: "Next results",
  community_nextResults: "Previous results",
  community_noResults: "No matching results found.",

  clients_fetchingData: "Fetching client data...",
  clients_dietPlan: "Diet plan",
  clients_showNotes: "Show notes",
  clients_hideNotes: "Hide notes",
  clients_assign: "Assign",
  clients_assignHeading:
    "Please, enter the email of the client you would like to add.",
  clients_notes: "Client notes",
  clients_addNewClient: "Add a new client",
  clients_notes_error:
    "An error has occured when trying to update the client's notes.",

  client_addNewMeal: "Add a new meal",
  client_noMeals:
    "This clients diet plan is empty. You can add a meal to it with the above button.",
  client_fetchingData: "Fetching client's diet data...",
  client_datchingMealData: "Fetching meal data...",

  calendar_noMealsClient:
    "You have no meals in your diet plan. Contact your dietitian if you think some meals should already be present.",
  calendar_previousMonth: "Previous month",
  calendar_currentMonth: "Current month",
  calendar_nextMonth: "Next month",
  calendar_monday: "Mon",
  calendar_tuesday: "Tue",
  calendar_wednesday: "Wed",
  calendar_thursday: "Thu",
  calendar_friday: "Fri",
  calendar_saturday: "Sat",
  calendar_sunday: "Sun",

  mealCard_noNameError: "Please provide the name of the meal.",
  mealCard_noInstructionsError: "Please provide cooking instructions.",
  mealCard_noCookingTimeError: "Please provide cooking time.",
  mealCard_noDateError: "Please proide the date of the meal.",
  mealCard_somethingMissingError:
    "Name, date, cooking time, and date of the meal as well as at least one ingredient are required.",
  mealCard_noIngredients: "At least one ingredient is required.",
  mealCard_fixExisitngErrors: "Please correct existing errors.",
  mealCard_finishAndSave: "Save the meal",
  mealCard_finishAndAdd: "Add the meal",
  mealCard_emptyPhotoExplain:
    "If left empty, the above default iage will be used as the meal's photo.",
  mealCard_showIngredients: "Show ingredients",
  mealCard_showNutrients: "Show nutrients",

  meal_photoURL: "Meal Photo URL",
  meal_name: "Meal name",
  meal_cookingTimeInMinutes: "Cooking time (in minutes)",
  meal_cookingTime: "Cooking time",
  meal_minutes: "minutes",
  meal_date: "Date of the meal",
  meal_instructions: "Cooking instructions",

  addEditMeal_noClientData: "No client details found.",
  addEditMeal_useTemplate: "Use a template",
  addEditMeal_templateWarning:
    "Using a template will erase the current configuration of the form and replace it with the template.",

  newIngredient_ingredientSource: "Source of ingredient data:",
  newIngredient_EdamamAPI: "Edamam's Food & Grocery API",
  newIngredient_customIngredients: "My custom ingredients",
  newIngredient_ingredientNameSearch: "Ingredient name",
  newIngredient_ingredientNameSearchEdamam: "Ingredient name",
  newIngredient_noMatch: "No matching ingredients found.",
  newIngredient_add: "Add",

  ingredientList_addNewIngredient: "Add a new ingredient",
  ingredientList_fetchingData: "Fetching ingredient data...",
  ingredientList_createNewIngredient: "Create a new ingredient",
  ingredientList_noIngredients:
    "You have no custom ingredients. You may create a custom ingredient with the above button.",

  ingredientCard_IngredientName: "Ingredient name",
  ingredientCard_nutritionPergram: "Nutritional values per gram",
  ingredientCard_deleteIngredient: "Delete ingredient",
  ingredientCard_showNutrients: "Show nutrients",
  ingredientCard_hideNutrients: "Hide nutrients",
  ingredientCard_createIngredient: "Create ingredient",

  templates_addnewTemplate: "Add a new template",
  templates_fetchingData: "Fetching templates data...",

  clientProfile_fetchingDietitianData: "Fetching dietitian data...",
  clientProfile_fetchingData: "Fetching profile data...",
  clientProfile_noDietitian:
    "You do not have a dietitian assigned to you. You may find a dietitian through the community tab.",
  clientProfile_you: "You",
  clientProfile_yourDietitian: "Your current dietitian",
  clientProfile_yourRating: "Your dietitian rating",
  clientProfile_save: "Save",
  clientProfile_reset: "Reset",
  clientProfile_unassign: "Unassign Yourself",
  clientProfile_unassignWarning:
    "Are you sure you want to unassign yourself? This operation cannot be undone.",
  clientProfile_iUnderstand: "Yes, I understand",
  clientProfile_cancel: "Cancel",

  updateClient_error_noEmail: "Email address was not found.",
  updateClient_error_noValues: "No values to update were found.",
  notFound_client: "The account to update was not found.",
  updateClient_error_passwordMismatch:
    "The current password given was invalid.",
  updateClient_success: "Success - The account was updated.",

  updateUser_error_noEmail: "Email address was not found.",
  updateUser_error_noValues: "No values to update were found.",
  notFound_user: "The account to update was not found.",
  updateUser_error_passwordMismatch: "The current password given was invalid.",
  updateUser_success: "Success - The account was updated.",

  createIngredient_error_noNameNoNutrients:
    "The ingredient name or nutrients were not found.",
  createIngredient_success: "Success - Ingredient was created.",

  updateIngredient_error_noNameNoNutrients:
    "The ingredient name or nutrients were not found.",
  updateIngredient_error_noId: "Ingredient ID not found.",
  updateIngredient_error_invalidId: "Invalid ingredient ID.",
  updateIngredient_error_notAssigned: "Ingredient is not assigned to anyone.",
  updateIngredient_error_invalidOwnerId:
    "The ID of the owner of the ingredient is not valid.",
  updateIngredient_error_ownerNotFound: "The ingredient's owner was not found.",
  updateIngredient_success: "Success - Ingredient was updated.",

  deleteIngredient_error_noId: "Ingredient ID was not found.",
  deleteIngredient_error_invalidId: "Invalid ingredient ID.",
  deleteIngredient_error_notAssigned: "Ingredient is not assigned to anyone.",
  deleteIngredient_error_invalidOwnerId:
    "The ID of the owner of the ingredient is not valid.",
  deleteIngredient_error_ownerNotFound: "The ingredient's owner was not found.",
  deleteIngredient_success: "Success - Ingredient deleted.",

  meal_error_noReqData:
    "Name, ingredients, cooking time, recipe, or date of the meal was not found.",
  meal_error_ownerNotFound: "The owner of the meal couldn not be found.",
  meal_error_invalidOwnerId: "Owner of the meal has an invalid ID",
  meal_error_noId: "Meal ID was not found.",
  meal_error_invalidId: "Provided meal ID is invalid.",
  meal_error_clientNoUser:
    "The account with the provided email has no dietitian assigned.",
  meal_error_invalidOwnerUser:
    "Dietitian of the owner of the meal has an invalid ID.",
  meal_error_ownerUserNotFound:
    "The dietitian of the owner of the meal could not be found.",
  meal_create_success: "Success - Meal created.",
  meal_createTemplate_success: "Success - Template meal created",
  meal_update_success: "Success - Meal updated.",

  assign_error_noUserEmail: "Dietitian's email address was not found.",
  assign_error_userNotFound:
    "Dietitian with the given email address was not found.",
  assign_error_clientNotFound: "No user with the given email was found.",
  assign_error_alreadyAssigned: "This client is already assigned to you.",
  assign_error_assignedToOther:
    "This client is assigned to another dietitian already.",
  assign_success: "Success - Client assigned.",

  createAccount_success:
    "Account created - an email with the account activation link has been sent.",

  activateAccount_waiting: "Awaiting server response...",
  activateAccount_successHeading: "Account activated!",
  activateAccount_successBody:
    "Your account has been sucesfully activated. You may now log in.",
  activateAccount_errorHeading: "Account activation failure!",
  activateAccount_errorBody1:
    "An error has occured while trying to activate the account ",
  activateAccount_errorBody2: ". Please contact administrators.",
};
