/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      page: number;
      /** page size */
      pageSize: number;
      /** total count */
      total: number;
    }
    interface PaginatingCommonMeta {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    }
    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> {
      items: T[];
      meta: PaginatingCommonMeta;
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'page' | 'pageSize'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;
    type CommonOperateResponse<T = any> = {
      code: number;
      message: string;
      data: T;
    };
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      userId: string;
      username: string;
      roles: string[];
      buttons: string[];
    }

    interface CaptchaResult {
      img: string;
      id: string;
    }
    interface LoginParams {
      username: string;
      password: string;
      verifyCode: string;
      captchaId: string;
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'page' | 'pageSize'>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleName' | 'roleCode'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      username: string;
      /** user gender */
      userGender: UserGender | null;
      /** user nick name */
      nickName: string;
      /** user phone */
      userPhone: string;
      /** user email */
      userEmail: string;
      /** user role code collection */
      userRoles: string[];
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'username' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'status'> &
        CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * menu type
     *
     * - "0": directory
     * - "1": menu
     * - "2": button
     */
    type MenuType = 0 | 1 | 2;

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
      | 'i18nKey'
      | 'keepAlive'
      | 'constant'
      | 'orderNo'
      | 'href'
      | 'hideInMenu'
      | 'activeMenu'
      | 'multiTab'
      | 'fixedIndexInTab'
      | 'query'
    >;

    type Menu = Common.CommonRecord<{
      id: number;
      /** parent menu id */
      parentId: number;
      /** menu type */
      type: MenuType;
      /** menu name */
      name: string;
      /** route name */
      routeName?: string;
      /** route path */
      path: string;
      /** component */
      component?: string;
      /** permission */
      permission?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** children menu */
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      pid: number;
      children?: MenuTree[];
    };
  }

  namespace Box {
    type Summary = Common.CommonRecord<{
      index: number;
      /** environment: X, GO, ICBC */
      environment: string;
      /** is multi-tenant */
      isMultiTenant: boolean;
      /** customer name */
      customerName: string;
      /** service url */
      serviceUrl: string;
      /** login username */
      username: string;
      /** login password */
      password?: string;
      /** remarks */
      remark?: string;
      opsDoc?: string;
    }>;
    type SummaryList = Common.PaginatingQueryRecord<Summary>;

    /** BOX search params */
    type SummarySearchParams = CommonType.RecordNullable<
      Pick<Api.Box.Summary, 'environment' | 'customerName'> & Common.CommonSearchParams
    >;
    /** create model */
    type CreateSummary = Omit<Summary, keyof Common.CommonRecord>;

    /** update model */
    type UpdateSummary = Partial<CreateSummary>;
  }
}
