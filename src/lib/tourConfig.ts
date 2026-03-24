import { Config } from 'driver.js';

export const getTourConfig = (role: string, onComplete: () => void): Config => {
  const commonSteps = [
    {
      element: '#tour-notifications',
      popover: {
        title: 'System Notifications',
        description: 'Stay updated with real-time alerts about your account activity and approvals.',
        side: "bottom",
        align: 'start'
      }
    },
    {
      element: '#tour-profile',
      popover: {
        title: 'Your Profile',
        description: 'Manage your personal settings, security preferences, and account details here.',
        side: "bottom",
        align: 'end'
      }
    }
  ];

  const roleSteps: Record<string, any[]> = {
    member: [
      {
        element: '#tour-savings-balance',
        popover: {
          title: 'Savings Balance',
          description: 'View your total contribution balance. Regular savings builds your credit limit!',
          side: "bottom"
        }
      },
      {
        element: '#tour-loan-balance',
        popover: {
          title: 'Loan Overview',
          description: 'Track your active loans and current outstanding balance.',
          side: "bottom"
        }
      },
      {
        element: '#tour-menu-loans',
        popover: {
          title: 'Apply for Loans',
          description: 'Ready for credit? Use this menu to apply for new loans and track approval workflow.',
          side: "right"
        }
      },
      {
        element: '#tour-menu-wallet',
        popover: {
          title: 'Payment Wallet',
          description: 'Manage your funds, top up your account, and make transfers easily.',
          side: "right"
        }
      }
    ],
    group_admin: [
      {
        element: '#tour-menu-members',
        popover: {
          title: 'Member Management',
          description: 'Add new members to your group and manage their membership status.',
          side: "right"
        }
      },
      {
        element: '#tour-menu-reports',
        popover: {
          title: 'Group Reports',
          description: 'Generate detailed reports for your group activities and financial summaries.',
          side: "right"
        }
      }
    ],
    super_admin: [
      {
        element: '#tour-menu-partners',
        popover: {
          title: 'Partner Management',
          description: 'Oversee all partner organizations and cooperatives on the platform.',
          side: "right"
        }
      },
      {
        element: '#tour-menu-settings',
        popover: {
          title: 'System Settings',
          description: 'Configure global platform parameters, interest rates, and role permissions.',
          side: "right"
        }
      }
    ]
  };

  const steps = [
    {
      popover: {
        title: 'Welcome to Coop-OS!',
        description: 'Let us take you on a quick tour of your new digital cooperative workspace.',
      }
    },
    ...(roleSteps[role] || roleSteps['member']),
    ...commonSteps,
    {
      popover: {
        title: 'All Set!',
        description: 'You are ready to explore Coop-OS. You can restart this tour anytime from your profile settings.',
      }
    }
  ];

  return {
    showProgress: true,
    steps,
    onDestroyStarted: (Element, step, state: any) => {
      onComplete();
      state.driver.destroy();
    }
  };
};
