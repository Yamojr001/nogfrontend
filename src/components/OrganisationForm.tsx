'use client';
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/GridLegacy';
import { 
  TextField, MenuItem, FormControlLabel, Switch, 
  Typography, Box, Divider, Autocomplete, 
  Paper, InputAdornment
} from '@mui/material';
import { 
  Business as BusinessIcon,
  EmojiTransportation as SectorIcon,
  LocationOn as AddressIcon,
  Person as RepIcon,
  AccountBalance as BankIcon,
  Savings as SavingsIcon,
  Badge as IdIcon
} from '@mui/icons-material';
import { fetchBanks } from '@/lib/api';

interface OrganisationFormProps {
  data: any;
  onChange: (newData: any) => void;
  showParentSelection?: boolean;
  parents?: any[];
}

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
  <Box sx={{ mb: 3, mt: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
      <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(0, 77, 64, 0.08)', display: 'flex' }}>
        <Icon sx={{ color: '#004d40', fontSize: '1.2rem' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
        {title}
      </Typography>
    </Box>
    {subtitle && <Typography variant="body2" sx={{ color: '#64748b', ml: 5 }}>{subtitle}</Typography>}
    <Divider sx={{ mt: 2, borderStyle: 'dashed', borderColor: '#e2e8f0' }} />
  </Box>
);

export default function OrganisationForm({ data, onChange, showParentSelection, parents }: OrganisationFormProps) {
  const [banks, setBanks] = useState<any[]>([]);

  useEffect(() => {
    fetchBanks().then(setBanks).catch(console.error);
  }, []);

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#ffffff',
      transition: 'all 0.2s',
      '&:hover': { bgcolor: '#f8fafc' },
      '&.Mui-focused': { bgcolor: '#ffffff', boxShadow: '0 0 0 4px rgba(0, 77, 64, 0.1)' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.9rem', color: '#64748b' }
  };

  return (
    <Box sx={{ '& .MuiGrid-item': { py: 1.5 } }}>
      {/* SECTION A */}
      <SectionHeader 
        icon={BusinessIcon} 
        title="Organization Core Information" 
        subtitle="Basic legal and operational identity of the entity." 
      />
      
      <Grid container spacing={2}>
        {showParentSelection && (
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Parent Organization (Partner) *"
              value={data.parentId || ''}
              onChange={(e) => handleChange('parentId', e.target.value)}
              sx={inputStyle}
            >
              <MenuItem value="">Select Parent...</MenuItem>
              {parents?.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </TextField>
          </Grid>
        )}

        <Grid item xs={12} md={8}>
          <TextField fullWidth label="Official Name *" value={data.name || ''} onChange={(e) => handleChange('name', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Acronym / Short Name" value={data.acronym || ''} onChange={(e) => handleChange('acronym', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth type="date" label="Establishment Date" InputLabelProps={{ shrink: true }} value={data.establishmentDate || ''} onChange={(e) => handleChange('establishmentDate', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select fullWidth label="Organization Type" value={data.orgTypeStr || ''} onChange={(e) => handleChange('orgTypeStr', e.target.value)} sx={inputStyle}>
            {['Cooperative Society', 'Artisan Union', 'NGO', 'CSO', 'Business Association', 'Other'].map(v => (
              <MenuItem key={v} value={v}>{v}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select fullWidth label="Economic Sector" value={data.sector || ''} onChange={(e) => handleChange('sector', e.target.value)} sx={inputStyle} 
            InputProps={{ startAdornment: <InputAdornment position="start"><SectorIcon sx={{ fontSize: 20, color: '#94a3b8' }} /></InputAdornment> }}
          >
            {['Agriculture', 'Education', 'Transport', 'Health', 'Trade', 'ICT', 'Literacy/Skills Dev', 'Other'].map(v => (
              <MenuItem key={v} value={v}>{v}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Registration Number (CAC / Coop)" value={data.regNumber || ''} onChange={(e) => handleChange('regNumber', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth type="number" label="Total Active Members" value={data.activeMemberCount || ''} onChange={(e) => handleChange('activeMemberCount', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Operating States / Zones" value={data.operatingStates || ''} onChange={(e) => handleChange('operatingStates', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={2} label="Headquarters Address" value={data.hqAddress || ''} onChange={(e) => handleChange('hqAddress', e.target.value)} sx={inputStyle}
            InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: -3 }}><AddressIcon sx={{ fontSize: 20, color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Grid>
      </Grid>

      {/* SECTION B: REPRESENTATIVE */}
      <Box sx={{ mt: 4 }}>
        <SectionHeader 
          icon={RepIcon} 
          title="Contact Person / Representative" 
          subtitle="Details of the official representative for this organization." 
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <TextField fullWidth label="Full Name of Representative" value={data.repName || ''} onChange={(e) => handleChange('repName', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Gender" value={data.repGender || ''} onChange={(e) => handleChange('repGender', e.target.value)} sx={inputStyle}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Position / Designation" value={data.repPosition || ''} onChange={(e) => handleChange('repPosition', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Official Phone Number" value={data.repPhone || ''} onChange={(e) => handleChange('repPhone', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth type="email" label="Official Email Address" value={data.repEmail || ''} onChange={(e) => handleChange('repEmail', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Nationality" value={data.repNationality || 'Nigerian'} onChange={(e) => handleChange('repNationality', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="State of Origin / LGA" value={data.repStateOfOrigin || ''} onChange={(e) => handleChange('repStateOfOrigin', e.target.value)} sx={inputStyle} />
        </Grid>
      </Grid>

      {/* SECTION C: ID */}
      <Box sx={{ mt: 4 }}>
        <SectionHeader 
          icon={IdIcon} 
          title="Identification & Compliance" 
          subtitle="Official regulatory and identity identification numbers." 
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Organization's TIN" value={data.orgTin || ''} onChange={(e) => handleChange('orgTin', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Representative's NIN" value={data.repNin || ''} onChange={(e) => handleChange('repNin', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Representative's BVN" value={data.repBvn || ''} onChange={(e) => handleChange('repBvn', e.target.value)} sx={inputStyle} />
        </Grid>
      </Grid>

      {/* SECTION D: SAVINGS */}
      <Box sx={{ mt: 4 }}>
        <SectionHeader 
          icon={SavingsIcon} 
          title="Savings & Engagement Profile" 
          subtitle="Cooperative participation and financial contributions." 
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 0.5, px: 2, borderRadius: '12px', bgcolor: 'rgba(0, 77, 64, 0.02)', border: '1px solid rgba(0, 77, 64, 0.08)' }}>
            <FormControlLabel
              control={<Switch checked={!!data.participateInSavings} onChange={(e) => handleChange('participateInSavings', e.target.checked)} color="primary" />}
              label={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Enable cooperative savings program for this entity?</Typography>}
            />
          </Paper>
        </Grid>
        {data.participateInSavings && (
          <>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Savings Frequency" value={data.savingsFrequency || 'Monthly'} onChange={(e) => handleChange('savingsFrequency', e.target.value)} sx={inputStyle}>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Quarterly">Quarterly</MenuItem>
                <MenuItem value="Annually">Annually</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth type="number" label="Periodic Contribution (₦)" value={data.monthlyContributionAmount || 0} onChange={(e) => handleChange('monthlyContributionAmount', Number(e.target.value))} sx={inputStyle}
                InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* SECTION E: ORG BANKING */}
      <Box sx={{ mt: 4 }}>
        <SectionHeader 
          icon={BankIcon} 
          title="Organization Bank Account" 
          subtitle="Official settlement account for organizational transactions." 
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Account Name" value={data.orgAccountName || ''} onChange={(e) => handleChange('orgAccountName', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={banks}
            getOptionLabel={(option) => option.name}
            value={banks.find(b => b.name === data.orgBankName) || null}
            onChange={(_, newValue) => handleChange('orgBankName', newValue?.name || '')}
            renderInput={(params) => <TextField {...params} label="Bank Name" sx={inputStyle} />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Account Number" value={data.orgAccountNumber || ''} onChange={(e) => handleChange('orgAccountNumber', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Organization BVN (Linked)" value={data.orgBvn || ''} onChange={(e) => handleChange('orgBvn', e.target.value)} sx={inputStyle} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Authorized Signatories (Names)" value={data.signatories || ''} onChange={(e) => handleChange('signatories', e.target.value)} placeholder="Provide names of approved signatories" sx={inputStyle} 
            helperText="Provide at least two authorized names separated by commas."
          />
        </Grid>
      </Grid>
    </Box>
  );
}
