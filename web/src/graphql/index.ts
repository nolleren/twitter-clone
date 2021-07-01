/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createProfile
// ====================================================

export interface createProfile_createProfile {
  id: number;
}

export interface createProfile {
  createProfile: createProfile_createProfile | null;
}

export interface createProfileVariables {
  bio?: string | null;
  location?: string | null;
  avatar?: string | null;
  website?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateProfile
// ====================================================

export interface updateProfile_updateProfile {
  id: number;
}

export interface updateProfile {
  updateProfile: updateProfile_updateProfile | null;
}

export interface updateProfileVariables {
  id: number;
  bio?: string | null;
  location?: string | null;
  avatar?: string | null;
  website?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_profile {
  id: number;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar: string | null;
}

export interface me_me {
  id: number;
  profile: me_me_profile | null;
}

export interface me {
  me: me_me | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
