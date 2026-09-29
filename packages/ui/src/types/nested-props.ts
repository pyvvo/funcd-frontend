/**
 *  @see https://gist.github.com/staltz/368866ea6b8a167fbdac58cddf79c1bf?permalink_comment_id=3805194#gistcomment-3805194
 * @see https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
 * @see https://steveholgado.com/typescript-types-from-arrays/
 */

/**
 *  not implemented yet @see https://github.com/microsoft/TypeScript/issues/34933
 */
// export type NestedKeyOf<dynamicValue extends object | readonly any[]> = {
//   [Key in keyof dynamicValue &
//     (string | number)]: dynamicValue[Key] extends object
//     ? `${Key}` | `${Key}.${NestedKeyOf<dynamicValue[Key]>}`
//     : dynamicValue extends any[]
//     ? `${dynamicValue[number]}`
//     : `${Key}`;
// }[keyof dynamicValue & (string | number)];

export type NestedKeyOf<DynamicValue extends object> = {
  [Key in keyof DynamicValue &
    (string | number)]: DynamicValue[Key] extends any[]
    ? `${Key}`
    : DynamicValue[Key] extends object
      ? `${Key}.${NestedKeyOf2<DynamicValue[Key]>}`
      : `${Key}`;
}[keyof DynamicValue & (string | number)];

type NestedKeyOf2<DynamicValue extends object> = {
  [Key in keyof DynamicValue &
    (string | number)]: DynamicValue[Key] extends any[]
    ? `${Key}`
    : DynamicValue[Key] extends object
      ? `${Key}.${NestedKeyOf3<DynamicValue[Key]>}`
      : `${Key}`;
}[keyof DynamicValue & (string | number)];

type NestedKeyOf3<DynamicValue extends object> = {
  [Key in keyof DynamicValue &
    (string | number)]: DynamicValue[Key] extends any[]
    ? `${Key}`
    : DynamicValue[Key] extends object
      ? `${Key}.${NestedKeyOf4<DynamicValue[Key]>}`
      : `${Key}`;
}[keyof DynamicValue & (string | number)];

type NestedKeyOf4<DynamicValue extends object> = {
  [Key in keyof DynamicValue &
    (string | number)]: DynamicValue[Key] extends any[]
    ? `${Key}`
    : DynamicValue[Key] extends object
      ? `${Key}.${NestedKeyOf5<DynamicValue[Key]>}`
      : `${Key}`;
}[keyof DynamicValue & (string | number)];

type NestedKeyOf5<DynamicValue extends object> = {
  [Key in keyof DynamicValue & (string | number)]: `${Key}`;
}[keyof DynamicValue & (string | number)];

/** Union of primitives to skip with deep omit utilities. */
export type Primitive = string | number | boolean | undefined | null;
/** Variable Kind */
type VariableKind = string | number | boolean;

/**
 *  @see https://gist.github.com/ahuggins-nhs/826906a58e4c1e59306bc0792e7826d1
 */

/** Deeply omit members of an array of interface or array of type. */
export type DeepOmitArray<T extends object[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>;
};

export type DeepOmit<T, K> = T extends Primitive
  ? T
  : {
      [P in Exclude<keyof T, K>]: T[P] extends infer TP
        ? TP extends Primitive[]
          ? TP
          : TP extends object[]
            ? DeepOmitArray<TP, K>
            : TP extends Primitive
              ? TP // leave primitives and functions alone
              : DeepOmit<TP, K>
        : never;
    };

/**
 * Omit given variable
 */
export type DeepOmitVariableKind<
  T,
  U extends VariableKind | Primitive[] | Record<string, any>[] | any[]
> = {
  [P in Exclude<keyof T, GetKeyKind<T, U>>]: T[P] extends infer TP
    ? TP extends any[]
      ? TP
      : TP extends object
        ? DeepOmitVariableKind<TP, U>
        : TP
    : never;
};

type GetKeyKind<
  T,
  U extends VariableKind | Primitive[] | Record<string, any>[]
> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
type XYZ = { x: number; y: string; z: boolean; k: { a: number } };
type T3a = Exclude<keyof XYZ, 'k.a'>;

const kk = {
  aa: 12,
  bb: 'machin',
  cc: true,
  dd: { astring: '', bnumber: 12, cobject: { aa: 12, cc: [{ test: true }] } }
};

// const tt: NestedKeyOf<DeepOmitVariableKind<typeof kk, number>> = '' ;
// type Get = GetKeyKind<typeof kk.dd.cobject, any[]>;
export type DeepNonNullable<T> = T extends Primitive
  ? T
  : {
      [P in keyof T]: T[P] extends infer TP
        ? TP extends object
          ? DeepNonNullable<TP> // leave primitives and functions alone
          : NonNullable<TP>
        : never;
    };

/**
 *  Deep remove undefined
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

// export type NonNullable<T> = Exclude<T, null | undefined>;
// export type NoUndefinedField<T> = {
//   [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
// };

// const Requiredall: DeepNonNullable<UserTest>;

/**
 *  below is a test for NestedKeyOf
 */
/*
const data = {
  id: '',
  createdAt: '',
  updatedAt: '',
  userType: 'customer',
  owner: '',
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    language: 'fr',
    facebook: '',
    linkedin: '',
    phone: '',
    Image: ''
  },
  address: {
    name: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    province: '',
    provinceCode: '',
    country: '',
    countryCode: '',
    latitude: '',
    longitude: ''
  },
  authData: {
    username: '',
    attributes: [{ name: 'email', value: 'test@mail.com', isVerified: false }],
    userGroups: ['Admin'],
    userCreateDate: '',
    userLastModifiedDate: '',
    enabled: true,
    userStatus: 'unknow',
    mfa: {
      mfaOptions: [
        {
          deliveryMedium: '',
          attributeName: ''
        }
      ],
      preferredMfaSetting: '',
      userMFASettingList: ''
    }
  }
};

// const keyTest: NestedKeyOf<typeof data> = '';
*/
