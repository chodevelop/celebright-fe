import React from 'react';
import { Grid, IconButton, TextField, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

type Feed = { img: File | null; link: string; title: string };

type FeedRecommendationsProps = {
  Feeds: Feed[];
  pathname: string;
  onAddFeed: () => void;
  onRemoveFeed: (index: number) => void;
  onFeedsChange: (index: number, field: string, value: any) => void;
};

const FeedRecommendations: React.FC<FeedRecommendationsProps> = ({
  pathname,
  Feeds,
  onAddFeed,
  onRemoveFeed,
  onFeedsChange,
}) => {
  return (
    <>
      {Feeds.map((Feeds, index) => (
        <Grid
          container
          spacing={1}
          alignItems='center'
          sx={{ mb: 1 }}
          key={index}
        >
          <Grid item xs={3}
            sx={{ textAlign: "center" }}
          >
            {Feeds.img ? (
              <img
                src={
                  pathname.includes('update')
                    ? typeof Feeds.img === 'string'
                      ? Feeds.img
                      : URL.createObjectURL(Feeds.img)
                    : URL.createObjectURL(Feeds.img)
                }
                alt={`product-preview-${index}`}
                style={{ width: '100%', height: 'auto', borderRadius: 4 }}
              />
            ) : (
              <IconButton component='label'
                sx={{ border: "1px solid #A88EFF" }}
              >
                <UploadIcon />
                <input
                  hidden
                  type='file'
                  accept='image/*'
                  onChange={(e) =>
                    e.target.files &&
                    onFeedsChange(index, 'img', e.target.files[0])
                  }
                />
              </IconButton>
            )}
          </Grid>
          <Grid item xs={4}>
            <TextField
              size='small'
              placeholder='제품명'
              value={Feeds.title}
              onChange={(e) => onFeedsChange(index, 'title', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size='small'
              placeholder='링크'
              value={Feeds.link}
              onChange={(e) => onFeedsChange(index, 'link', e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton color='primary' onClick={() => onRemoveFeed(index)}>
              <RemoveCircleIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        variant='outlined'
        startIcon={<UploadIcon />}
        onClick={onAddFeed}
        fullWidth
        sx={{ mb: 2 }}
      >
        추천 제품 추가
      </Button>
    </>
  );
};

export default FeedRecommendations;
